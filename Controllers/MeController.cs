using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using olhrk_web.Models;

namespace olhrk_web.Controllers
{
    [Authorize]
    public class MeController : ApiController
    {
 
        public MeController()
        {
        }

    }
}