using Amazon.Lambda.Core;
using Amazon.Runtime.Internal.Util;
using Amazon.S3;
using Character.WebScraper.Shared;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Character.WebScraper;

public class Function
{

	private readonly ILogger<Function> _logger;
	private readonly HtmlWeb _htmlWeb;
	private readonly IAmazonS3 _amazonS3;


	public Function(ILogger<Function> logger, HtmlWeb htmlWeb, IAmazonS3 amazonS3) {
		Startup.ConfigureServices();

		_logger = logger;
		_htmlWeb = htmlWeb;
		_amazonS3 = amazonS3;
		
	}
    
  /// <summary>
  /// A simple function that takes a string and does a ToUpper
  /// </summary>
  /// <param name="input"></param>
  /// <param name="context"></param>
  /// <returns></returns>
  public string FunctionHandler(string input, ILambdaContext context)
  {
		return input.ToUpper();
  }
}
