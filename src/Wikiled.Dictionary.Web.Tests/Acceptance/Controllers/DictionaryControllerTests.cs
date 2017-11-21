using System;
using System.Linq;
using System.Net.Http;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;
using Wikiled.Core.Standard.Api.Client;
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

        private DictionaryController CreateDictionaryController()
        {
            return new DictionaryController(dictionaryManager, new MemoryCache(new MemoryCacheOptions()));
        }
    }
}
