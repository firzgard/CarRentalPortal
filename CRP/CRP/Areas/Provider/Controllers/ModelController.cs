using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{
    [Authorize(Roles = "Provider")]
    public class ModelController : Controller
    {
        // GET: Provider/Model
        public ActionResult Index()
        {
            return View();
        }

        // GET: Provider/Model/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Provider/Model/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Provider/Model/Create
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

        // GET: Provider/Model/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Provider/Model/Edit/5
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

        // GET: Provider/Model/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Provider/Model/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
