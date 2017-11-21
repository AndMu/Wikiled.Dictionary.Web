using System;
using Microsoft.Extensions.Caching.Memory;
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

        private Mock<IMemoryCache> mockMemoryCache;

        [SetUp]
        public void SetUp()
        {
            mockDictionaryManager = new Mock<IDictionaryManager>();
            mockMemoryCache = new Mock<IMemoryCache>();
            instance = CreateDictionaryController();
        }

        [Test]
        public void Construct()
        {
            Assert.Throws<ArgumentNullException>(
                () => new DictionaryController(null, mockMemoryCache.Object));
            Assert.Throws<ArgumentNullException>(
                () => new DictionaryController(mockDictionaryManager.Object, null));
            Assert.IsNotNull(instance);
        }

        private DictionaryController CreateDictionaryController()
        {
            return new DictionaryController(mockDictionaryManager.Object, mockMemoryCache.Object);
        }
    }
}
