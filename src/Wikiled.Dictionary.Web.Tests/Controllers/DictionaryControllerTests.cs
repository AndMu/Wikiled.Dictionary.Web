using System;
using System.Linq;
using Moq;
using NUnit.Framework;
using Wikiled.Dictionary.Logic;
using Wikiled.Dictionary.Web.Controllers;

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
