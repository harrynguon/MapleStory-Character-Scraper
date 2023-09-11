using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Character.WebScraper.Shared.Interfaces
{
  public interface IAppSettings
  {
		public string MapleStoryLookupUrl { get; }
		public string S3BucketName { get; }

	}
}
