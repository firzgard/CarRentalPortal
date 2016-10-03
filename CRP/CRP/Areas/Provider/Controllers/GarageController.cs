using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;

namespace CRP.Areas.Provider.Controllers
{
    public class GarageController : Controller
    {
        GarageService service = new GarageService();
        // GET: CarBrand
        public ActionResult Index()
        {
            List<Garage> lstGara = new List<Garage>();
            lstGara = service.getAll();
            ViewBag.garaList = lstGara;
            return View();
        }
    }
}