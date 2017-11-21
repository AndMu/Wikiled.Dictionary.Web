using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Wikiled.Core.Standard.Arguments;
using Wikiled.Dictionary.Data;
using Wikiled.Dictionary.Logic;

namespace Wikiled.Dictionary.Web.Controllers
{
    [Route("api/[controller]")]
    public class DictionaryController : Controller
    {
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
                value = Enum.GetNames(typeof(Language));
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(30));
                cache.Set(languageKey, value, cacheEntryOptions);
            }

            return (string[])value;
        }
    }
}
