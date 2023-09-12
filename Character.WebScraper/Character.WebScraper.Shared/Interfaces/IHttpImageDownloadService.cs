using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Character.WebScraper.Shared.Interfaces
{
  public interface IHttpImageDownloadService
  {
		Task<byte[]> DownloadImageAsBytesAsync(string url);
		Task<Stream> DownloadImageAsStreamAsync(string url);
  }
}
