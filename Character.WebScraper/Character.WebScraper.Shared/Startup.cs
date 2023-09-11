using Amazon.S3;
using Amazon.S3.Model;
using Character.WebScraper.Shared.Interfaces;
using HtmlAgilityPack;
using Microsoft.Extensions.Configuration;
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
			serviceCollection.AddLogging();

			// Use configuration builder as you can pool in multiple sources
			// e.g. environment variables, appsettings.json, AWS SSM parameters
			var configuration = new ConfigurationBuilder()
				.AddEnvironmentVariables()
				.Build();


			// Now IConfig can be referenced
			serviceCollection.AddSingleton(configuration);
			serviceCollection.AddSingleton<IAppSettings, AppSettings>();

			serviceCollection.AddTransient<HtmlWeb>();

			serviceCollection.AddHttpClient<IHttpImageDownloadService, HttpImageDownloadService>();

			serviceCollection.AddAWSService<IAmazonS3>();

			Services = serviceCollection.BuildServiceProvider();
		}

  }
}
