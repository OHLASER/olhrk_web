using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(olhrk_web.Startup))]

namespace olhrk_web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // ConfigureAuth(app);
        }
    }
}
