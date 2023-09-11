using Character.WebScraper.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Character.WebScraper.Shared
{
  public class HttpImageDownloadService : IHttpImageDownloadService
  {

		private readonly HttpClient _httpClient;
		private readonly ILogger _logger;

		public HttpImageDownloadService(HttpClient httpClient, ILogger<HttpImageDownloadService> logger)
		{
			_httpClient = httpClient;
			_logger = logger;
		}

		public async Task<byte[]> DownloadImageAsync(string url)
		{
			try
			{
				_logger.LogInformation($"Downloading byte data from url: {url}...");

				return await _httpClient.GetByteArrayAsync(url);
			}
			 catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
				throw;
			}
		}
	}
}
