using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{
    public class BrandController : Controller
    {
        BrandService service = new BrandService();
        // GET: CarBrand
        public ActionResult Index()
        {
            List<Brand> lstBrand = new List<Brand>();
            lstBrand = service.getAll();
            ViewBag.brandList = lstBrand;
            return View();
        }

        // GET: Provider/CarBrand/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Provider/CarBrand/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Provider/CarBrand/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Provider/CarBrand/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Provider/CarBrand/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // POST: Provider/CarBrand/Delete/5

        [HttpPost]
        public String Delete()
        {
            int ID = int.Parse(Request.Params["id"]);

            if (service.delete(ID))
            {
                return "true";
            }
            return "false";
        }
    }
}
