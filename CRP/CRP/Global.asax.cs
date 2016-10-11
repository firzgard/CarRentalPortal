using Autofac;
using Autofac.Integration.Mvc;
using AutoMapper;
using CRP.Models.AutofacModules;
using CRP.Models.Entities;
using CRP.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace CRP
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            this.InitializeAutofac();
        }

        private void InitializeAutofac()
        {
            var assembly = Assembly.GetExecutingAssembly();

            var builder = new ContainerBuilder();
            builder.RegisterControllers()
                .PropertiesAutowired();

            builder.RegisterModule(new RepositoryModule(assembly));
            builder.RegisterModule(new ServiceModule(assembly));
            builder.RegisterModule(new EntityFrameworkModule(assembly));
            builder.RegisterModule(new AutoMapperModule(new AutoMapper.MapperConfiguration(this.MapperConfig)));

            var container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        public void MapperConfig(IMapperConfiguration config)
        {
            config.CreateMissingTypeMaps = true;
            config.CreateMap<VehicleGroup, VehicleGroupViewModel>();
        }
    }
}
