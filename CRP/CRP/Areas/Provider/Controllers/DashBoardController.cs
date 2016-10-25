using CRP.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{
    public class DashBoardController : BaseController
    {
        // GET: Provider/DashBoard
        public ActionResult Index()
        {
            return View("~/Areas/Provider/Views/DashBoard/Index.cshtml");
        }
    }
}