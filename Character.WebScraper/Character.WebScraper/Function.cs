using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;
using Character.WebScraper.Shared;
using Character.WebScraper.Shared.Interfaces;
using HtmlAgilityPack;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Character.WebScraper;

public class FunctionInput
{
	public IEnumerable<string>? MapleStoryUsernames { get; set; }
}

public class Function
{

	private readonly ILogger<Function> _logger;
	private readonly IAppSettings _appSettings;
	private readonly HtmlWeb _htmlWeb;
	private readonly IAmazonS3 _amazonS3;
	private readonly IHttpImageDownloadService _httpImageDownloadService;

	public Function() : this(null, null, null, null, null)
	{

	}

	public Function(ILogger<Function> logger, IAppSettings appSettings, HtmlWeb htmlWeb,
		IAmazonS3 amazonS3, IHttpImageDownloadService httpImageDownloadService) {
		Startup.ConfigureServices();

		_logger = logger ?? Startup.Services.GetRequiredService<ILogger<Function>>();
		_appSettings = appSettings ?? Startup.Services.GetRequiredService<IAppSettings>();
		_htmlWeb = htmlWeb ?? Startup.Services.GetRequiredService<HtmlWeb>();
		_amazonS3 = amazonS3 ?? Startup.Services.GetRequiredService<IAmazonS3>();
		_httpImageDownloadService = httpImageDownloadService ?? Startup.Services.GetRequiredService<IHttpImageDownloadService>();
	}
    
  /// <summary>
  /// A simple function that takes a string and does a ToUpper
  /// </summary>
  /// <param name="input"></param>
  /// <param name="context"></param>
  /// <returns></returns>
  public async Task<bool> FunctionHandler(FunctionInput request, ILambdaContext context)
  {
		_logger.LogInformation($"Request: {JsonSerializer.Serialize(request)}");

		if (request?.MapleStoryUsernames?.Count() == 0)
		{
			throw new ArgumentException("Please enter in a non-empty list of usernames.");
		}

		var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time");
		var nzDateTime = TimeZoneInfo.ConvertTime(DateTime.Now, timeZoneInfo);

		foreach (var username in request.MapleStoryUsernames)
		{
			_logger.LogInformation($"Performing user lookup for username '{username}'...");
			var htmlDocument = _htmlWeb.Load($"https://{_appSettings.MapleStoryLookupUrl}/u/{username}");

			// get all <img> tags, select all src="" values, filter only be image sources with the url in the value
			var imageUrl = htmlDocument?.DocumentNode?.Descendants("img")
				.Select(e => e.GetAttributeValue("src", null))
				.FirstOrDefault(s => s?.Contains(_appSettings.MapleStoryLookupUrl, StringComparison.OrdinalIgnoreCase) ?? false);

			if (string.IsNullOrEmpty(imageUrl))
			{
				_logger.LogInformation($"No image found for user '{username}'.");
				continue;
			}

			// download image
			_logger.LogInformation($"Downloading image content at URL: '{imageUrl}'...");

			var content = await _httpImageDownloadService.DownloadImageAsBytesAsync(imageUrl);

			if (content?.Length == 0)
			{
				_logger.LogInformation($"No image data was able to be downloaded at URL: '{imageUrl}'.");
				continue;
			}

			var path = $"pages/api/public/u/{username}";
			var fileName = $"{nzDateTime:yyyy-MM-dd}.png";

			using var memoryStream = new MemoryStream(content);

			var putObjectRequest = new PutObjectRequest
			{
				BucketName = _appSettings.S3BucketName,
				CannedACL = S3CannedACL.Private,
				Key = $"{path}/{fileName}",
				InputStream = memoryStream,
				ContentType = "image/png"
			};

			_logger.LogInformation($"Performing upload of image '{fileName}' to path: {path} in S3 bucket '{_appSettings.S3BucketName}'...");

			// upload to s3
			var response = await _amazonS3.PutObjectAsync(putObjectRequest);

			if (response.HttpStatusCode == HttpStatusCode.OK)
			{
				_logger.LogInformation($"Successfully uploaded '{fileName}' to path '{path}' in S3 bucket '{_appSettings.S3BucketName}'.");
			}
			else
			{
				_logger.LogInformation($"Error uploading to S3. Http status code: {response.HttpStatusCode}.");
			}

			// Wait a bit so the website doesn't get overloaded
			Task.Delay(1000).Wait();
		}

		return true;
  }
}
