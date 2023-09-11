using Amazon.S3;
using Amazon.S3.Model;
using HtmlAgilityPack;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Character.WebScraper.Shared
{
  public class Startup
  {

		public static ServiceProvider Services { get; private set; }

		public static void ConfigureServices()
		{
			var serviceCollection = new ServiceCollection();

			serviceCollection.AddTransient<HtmlWeb>();
			serviceCollection.AddAWSService<IAmazonS3>();

			serviceCollection.AddLogging();

			Services = serviceCollection.BuildServiceProvider();
		}

  }
}
