using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;
using Wikiled.Core.Standard.Api.Client;
using Wikiled.Dictionary.Data;
using Wikiled.Dictionary.Logic;
using Wikiled.Dictionary.Web.Controllers;

namespace Wikiled.Dictionary.Web.Tests.Acceptance.Controllers
{
    [TestFixture]
    public class DictionaryControllerTests
    {
        private DictionaryController instance;

        private DictionaryManager dictionaryManager;

        [SetUp]
        public void SetUp()
        {
            dictionaryManager = new DictionaryManager(new ApiClientFactory(new HttpClient(), new Uri("http://api.wikiled.com")));
            instance = CreateDictionaryController();
        }

        [Test]
        public void GetLanguages()
        {
            var languages = instance.GetLanguages();
            Assert.AreEqual(37, languages.Count());
            var languages2 = instance.GetLanguages();
            Assert.AreSame(languages2, languages);
        }

        [Test]
        public async Task TranslateCached()
        {
            var result = await instance.Translate(Language.English, Language.Lithuanian, "mother").ConfigureAwait(false);
            Assert.AreEqual(16, result.Translations.Length);
            var result2 = await instance.Translate(Language.English, Language.Lithuanian, "mother").ConfigureAwait(false);
            Assert.AreSame(result2, result);
        }

        private DictionaryController CreateDictionaryController()
        {
            return new DictionaryController(dictionaryManager, new MemoryCache(new MemoryCacheOptions()));
        }
    }
}
