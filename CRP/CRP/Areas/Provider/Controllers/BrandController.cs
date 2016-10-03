using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using CRP.Models.JsonModels;

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

        // POST: Provider/CarBrand/Edit/5
        [HttpPost]
        public String Edit()
        {
            //get du lieu
            int ID = int.Parse(Request.Params["id"]);
            string newBrand = Request.Params["brand"];
            Brand seaBrand = service.findByID(ID);
            seaBrand.Name = newBrand;
            if (service.UpdateBrand(seaBrand))
            {
                return "true";
            } else
            {
                return "false";
            }
        }

        // POST: Provider/CarBrand/Delete/5
        [HttpPost]
        public JsonResult Delete()
        {
            int ID = int.Parse(Request.Params["id"]);

            if (service.delete(ID))
            {
                return Json(new { isSucced= true});
            }
            return Json(new { isSucced = false });
        }
        [HttpGet]
        public Object getJsonBrand()
        {
            List<Brand> lstBrand = new List<Brand>();
            List<BrandModel> jsonBrands = new List<BrandModel>();
            lstBrand = service.getAll();
            foreach (Brand p in lstBrand)
            {
                BrandModel jsonBrand = new BrandModel();
                jsonBrand.ID = p.ID;
                jsonBrand.Name = p.Name;
                jsonBrands.Add(jsonBrand);
            }
            String json = JsonConvert.SerializeObject(jsonBrands);
            return json;
        }
    }
  }
