using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NLog;
using Wikiled.Core.Standard.Arguments;
using Wikiled.Dictionary.Data;
using Wikiled.Dictionary.Logic;

namespace Wikiled.Dictionary.Web.Controllers
{
    [Route("api/[controller]")]
    public class DictionaryController : Controller
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        private readonly IDictionaryManager manager;

        private readonly IMemoryCache cache;

        private string languageKey = "Languages";

        public DictionaryController(IDictionaryManager manager, IMemoryCache cache)
        {
            Guard.NotNull(() => manager, manager);
            Guard.NotNull(() => cache, cache);
            this.manager = manager;
            this.cache = cache;
        }

        [HttpGet]
        [Route("Languages")]
        public IEnumerable<string> GetLanguages()
        {
            return cache.GetOrCreate(
                languageKey,
                entry =>
                    {
                        entry.SlidingExpiration = TimeSpan.FromMinutes(30);
                        logger.Debug("GetLanguages");
                        return Enum.GetNames(typeof(Language));
                    });
        }

        [HttpGet("{from}/{to}/{word}")]
        public Task<TranslationResult> Translate(Language from, Language to, string word)
        {
            string key = $"{from}:{to}:{word}";
            return cache.GetOrCreateAsync(key, entry => TranslateInternal(@from, to, word, key));
        }

        private async Task<TranslationResult> TranslateInternal(Language @from, Language to, string word, string key)
        {
            logger.Debug("Translate: {0}", key);
            try
            {
                 var request = new TranslationRequest { From = @from, To = to, Word = word };
                var result = await manager.Translate(request, CancellationToken.None).ConfigureAwait(false);
                if (!result.IsSuccess)
                {
                    logger.Error("Operation failed: {0}", result.ErrorMessage);
                    return new TranslationResult { Request = request, Translations = new string[] { } };
                }

                return result.Data.Result;
            }
            catch (Exception e)
            {
                logger.Error(e);
                throw;
            }
        }
    }
}