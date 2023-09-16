using Character.WebScraper.Shared.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Character.WebScraper.Shared
{
  public class AppSettings : IAppSettings
	{

		private readonly IConfiguration _configuration;

		public AppSettings(IConfiguration configuration) {
			_configuration = configuration;
		}

		public string MapleStoryLookupUrl => _configuration.GetValue<string>("MapleStoryLookupUrl")?.TrimEnd('/') ?? string.Empty;

		public string S3BucketName => _configuration.GetValue<string>("S3BucketName") ?? string.Empty;

		public string CharacterLookupDelay => _configuration.GetValue<string>("CharacterLookupDelay") ?? "2250";

	}
}
