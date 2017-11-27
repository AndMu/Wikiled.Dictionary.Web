using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using Wikiled.Core.Standard.Api.Client;
using Wikiled.Dictionary.Data;
using Wikiled.Dictionary.Logic;
using Wikiled.Dictionary.Web.Controllers;
using Wikiled.Server.Core.Testing.Server;

namespace Wikiled.Dictionary.Web.Tests.Controllers
{
    [TestFixture]
    public class DictionaryControllerTests
    {
        private DictionaryController instance;

        private Mock<IDictionaryManager> mockDictionaryManager;

        private CacheHelper cacheHelper;

        [SetUp]
        public void SetUp()
        {
            mockDictionaryManager = new Mock<IDictionaryManager>();
            cacheHelper = new CacheHelper();
            instance = CreateDictionaryController();
        }

        [Test]
        public void GetLanguages()
        {
            var languages = instance.GetLanguages().ToArray();
            Assert.AreEqual(37, languages.Length);
            object value;
            cacheHelper.MemoryCache.Verify(item => item.TryGetValue("Languages", out value));
            cacheHelper.MemoryCache.Verify(item => item.CreateEntry(It.IsAny<object>()));
        }

        [Test]
        public async Task Translate()
        {
            var response = ServiceResponse<ServiceResult<TranslationResult>>.GoodResponse(
                new HttpResponseMessage(HttpStatusCode.OK),
                new ServiceResult<TranslationResult>
                    {
                        Result = new TranslationResult(),
                        Code = 200
                    });
            mockDictionaryManager
                .Setup(
                    item => item.Translate(It.IsAny<TranslationRequest>(), CancellationToken.None))
                .Returns(Task.FromResult(response));
            var result = await instance.Translate(Language.English, Language.Lithuanian, "Test").ConfigureAwait(false);
            Assert.AreEqual(response.Data.Result, result);
            object value;
            cacheHelper.MemoryCache.Verify(item => item.TryGetValue(It.IsAny<string>(), out value));
            cacheHelper.MemoryCache.Verify(item => item.CreateEntry(It.IsAny<object>()));
        }

        [Test]
        public async Task TranslateCached()
        {
            object translation = new TranslationResult();
            cacheHelper.MemoryCache.Setup(item => item.TryGetValue(It.IsAny<string>(), out translation)).Returns(true);
            var result = await instance.Translate(Language.English, Language.Lithuanian, "Test").ConfigureAwait(false);
            Assert.AreEqual(translation, result);
            cacheHelper.MemoryCache.Verify(item => item.CreateEntry(It.IsAny<object>()), Times.Never);
        }

        [Test]
        public void Construct()
        {
            Assert.Throws<ArgumentNullException>(
                () => new DictionaryController(null, cacheHelper.MemoryCache.Object));
            Assert.Throws<ArgumentNullException>(
                () => new DictionaryController(mockDictionaryManager.Object, null));
            Assert.IsNotNull(instance);
        }

        private DictionaryController CreateDictionaryController()
        {
            return new DictionaryController(mockDictionaryManager.Object, cacheHelper.MemoryCache.Object);
        }
    }
}
