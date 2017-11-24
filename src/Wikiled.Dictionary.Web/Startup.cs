using System;
using System.IO;
using System.Net.Http;
using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Extensions.Logging;
using NLog.Web;
using Wikiled.Core.Standard.Api.Client;
using Wikiled.Dictionary.Logic;

namespace Wikiled.Dictionary.Web
{
    public class Startup
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            env.ConfigureNLog("nlog.config");
            LogManager.Configuration.Variables["logDirectory"] =
                Configuration.GetSection("logging").GetValue<string>("path");
            logger.Debug($"Starting: {Assembly.GetExecutingAssembly().GetName().Version}");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddMemoryCache();
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.Register(ctx =>
                   {
                       var serviceClient = new HttpClient();
                       serviceClient.BaseAddress = new Uri("http://api.wikiled.com");
                       return new ApiClientFactory(serviceClient, serviceClient.BaseAddress);
                   })
                   .As<IApiClientFactory>();
            builder.RegisterType<DictionaryManager>()
                   .As<IDictionaryManager>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory)
        {
            loggerFactory.AddNLog();
            app.UseMvcWithDefaultRoute();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.AddNLogWeb();
        }
    }
}
