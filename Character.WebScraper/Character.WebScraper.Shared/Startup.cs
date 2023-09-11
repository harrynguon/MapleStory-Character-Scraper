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

			// Use configuration builder as you can pool in multiple sources
			// e.g. environment variables, appsettings.json, AWS SSM parameters
			var configuration = new ConfigurationBuilder()
				.AddEnvironmentVariables()
				.Build();

			// Now IConfig can be referenced
			serviceCollection.AddSingleton(configuration);


			serviceCollection.AddTransient<HtmlWeb>();
			serviceCollection.AddSingleton<IAppSettings, AppSettings>();

			serviceCollection.AddAWSService<IAmazonS3>();

			serviceCollection.AddLogging();

			Services = serviceCollection.BuildServiceProvider();
		}

  }
}
