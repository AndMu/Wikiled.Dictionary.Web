﻿using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Wikiled.Dictionary.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var builder = WebHost.CreateDefaultBuilder(args)
                                 .UseStartup<Startup>()
                                 .ConfigureServices(services => services.AddAutofac());

            return builder.Build();
        }
    }
}
