using Amazon.Lambda.Core;
using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Amazon.Runtime.Internal.Util;
using Amazon.S3;
using Amazon.S3.Model;
using Character.WebScraper.Shared;
using Character.WebScraper.Shared.Interfaces;
using HtmlAgilityPack;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Text.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Character.WebScraper;

public class FunctionInput
{
	public IEnumerable<string> MapleStoryUsernames { get; set; }
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
		_appSettings = appSettings ?? Startup.Services.GetRequiredService<AppSettings>();
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
		_logger.LogInformation(JsonSerializer.Serialize(request));

		if (request.MapleStoryUsernames?.Count() == 0)
		{
			throw new ArgumentException("Please enter in a non-empty list of usernames.");
		}

		foreach(var username in request.MapleStoryUsernames)
		{
			var htmlDocument = _htmlWeb.Load($"https://{_appSettings.MapleStoryLookupUrl}/u/{username}");

			// get all <img> tags, select all src="" values, filter only be image sources with the url in the value
			var imageUrl = htmlDocument?.DocumentNode?.Descendants("img")
				.Select(e => e.GetAttributeValue("src", null))
				.FirstOrDefault(s => s?.Contains(_appSettings.MapleStoryLookupUrl, StringComparison.OrdinalIgnoreCase) ?? false);

			if (string.IsNullOrEmpty(imageUrl))
			{
				_logger.LogInformation($"No image found for user: {username}.");
				continue;
			}

			// download image
			var bytes = await _httpImageDownloadService.DownloadImageAsync(imageUrl);

			// upload to s3
			
		}
		
		return true;
  }
}
