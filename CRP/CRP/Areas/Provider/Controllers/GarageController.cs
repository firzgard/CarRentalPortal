using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;

namespace CRP.Areas.Provider.Controllers
{
    public class GarageController : Controller
    {
        // GET: Provider/Garage
        public ActionResult Index()
        {
            return View();
        }
    }
}