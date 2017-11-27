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

        // GET api/values
        [HttpGet]
        [Route("Languages")]
        public IEnumerable<string> GetLanguages()
        {
            if (!cache.TryGetValue(languageKey, out var value) ||
                !(value is string[]))
            {
                logger.Debug("GetLanguages");
                value = Enum.GetNames(typeof(Language));
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(30));
                cache.Set(languageKey, value, cacheEntryOptions);
            }

            return (string[])value;
        }

        [HttpGet("{from}/{to}/{word}")]
        public async Task<TranslationResult> Translate(Language from, Language to, string word)
        {
            string key = $"{from}:{to}:{word}";
            if (!cache.TryGetValue(key, out var value) ||
                !(value is TranslationResult))
            {
                logger.Debug("Translate: {0}", key);
                try
                {
                    var request = new TranslationRequest { From = @from, To = to, Word = word };
                    var result = await manager.Translate(request, CancellationToken.None).ConfigureAwait(false);
                    if (result.IsSuccess)
                    {
                        var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(30));
                        cache.Set(key, result.Data.Result, cacheEntryOptions);
                    }
                    else
                    {
                        logger.Error("Operation failed: {0}", result.ErrorMessage);
                        return new TranslationResult
                        {
                            Request = request,
                            Translations = new string[] { }
                        };

                    }
                }
                catch (Exception e)
                {
                    logger.Error(e);
                    throw;
                }
            }

            return (TranslationResult)value;
        }
    }
}