using CRP.Controllers;
using CRP.Models.ViewModels;
using CRP.Models.Entities;
using CRP.Models.Entities.Repositories;
using CRP.Models.Entities.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;

namespace CRP.Areas.Admin.Controllers
{
    public class DashBoardController : BaseController
    {
        // GET: Admin/DashBoard
        public ActionResult Index()
        {
            ReportViewModel viewModel = new ReportViewModel();
            var serviceBooking = this.Service<IBookingReceiptService>();
            var serviceCar = this.Service<IVehicleService>();
            var serviceUser = this.Service<IUserService>();
            var serviceGarage = this.Service<IGarageService>();
            viewModel.booking = serviceBooking.Get(q => q.IsPending == false).ToList().Count();
            var bookSuccess = serviceBooking.Get(q => q.IsCanceled == false && q.IsPending == false).ToList().Count();
            viewModel.bookingSuccess = bookSuccess;
            viewModel.booking = serviceBooking.Get().ToList().Count();
            viewModel.vehicle = serviceCar.Get().ToList().Count();
            DateTime today = DateTime.Now;
            //tinh co bookingfee co dinh hay 5%
            viewModel.money = bookSuccess * 10000;
            viewModel.provider = serviceUser.Get(q => q.AspNetRoles.Any(r => r.Name == "Provider")).ToList().Count();
            viewModel.providerActive = serviceUser.Get(q => q.AspNetRoles.Any(r => r.Name == "Provider") && q.IsProviderUntil > today).ToList().Count();
            viewModel.customer = serviceUser.Get(q => q.AspNetRoles.Any(r => r.Name == "Customer")).ToList().Count();
            viewModel.customerActive = serviceUser.Get(q => q.AspNetRoles.Any(r => r.Name == "Customer") && q.LockoutEnabled == false).ToList().Count();
            viewModel.garage = serviceGarage.Get().ToList().Count();
            viewModel.garageActive = serviceGarage.Get(q => q.IsActive == true).ToList().Count();
            return View(viewModel);
        }

        [System.Web.Mvc.Route("api/reportProvider")]
        [System.Web.Mvc.HttpGet]
        public JsonResult getProviderListAPI()
        {
            var serviceUser = this.Service<IUserService>();
            var serviceBooking = this.Service<IBookingReceiptService>();
            var serviceCar = this.Service<IVehicleService>();
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            var lstProvider = serviceUser.Get(q => q.AspNetRoles.Any(r => r.Name == "Provider")).ToList();
            List<ReportProviderViewModel> listPro = new List<ReportProviderViewModel>();
            DateTime today = DateTime.Now;
            DateTime lastMonth = today.AddMonths(-1);
            foreach(AspNetUser item in lstProvider)
            {
                ReportProviderViewModel item2 = new ReportProviderViewModel();
                item2.ID = item.Id;
                item2.ProviderName = item.UserName;
                lstBooking = serviceBooking.Get(q => q.AspNetUser1.Id == item.Id && q.IsSelfBooking == false && q.IsCanceled == false &&
                q.IsPending == false).ToList();
                foreach(BookingReceipt boo in lstBooking)
                {
                    item2.money = (item2.money + boo.RentalPrice);
                }
                lstBooking = serviceBooking.Get(q => q.AspNetUser1.Id == item.Id && q.IsSelfBooking == false && q.IsCanceled == false &&
                q.IsPending == false && q.EndTime < lastMonth).ToList();
                foreach (BookingReceipt boo in lstBooking)
                {
                    item2.compare = (item2.compare + boo.RentalPrice);
                }
                item2.car = serviceCar.Get(q => q.Garage.OwnerID.Contains(item.Id)).ToList().Count();
                item2.status = !item.LockoutEnabled;
                listPro.Add(item2);
            }
            return Json(new { aaData = listPro }, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("api/reportGarage")]
        [System.Web.Mvc.HttpGet]
        public JsonResult getGarageListAPI()
        {
            var serviceGarage = this.Service<IGarageService>();
            var serviceBooking = this.Service<IBookingReceiptService>();
            var serviceCar = this.Service<IVehicleService>();
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            List<ReportGarageViewModel> listGarage = new List<ReportGarageViewModel>();
            var listGara = serviceGarage.Get().ToList();
            DateTime today = DateTime.Now;
            DateTime lastMonth = today.AddMonths(-1);
            foreach (Garage item in listGara)
            {
                ReportGarageViewModel item2 = new ReportGarageViewModel();
                item2.ID = item.ID;
                item2.GarageName = item.Name;
                lstBooking = serviceBooking.Get(q => q.GarageID == item.ID && q.IsSelfBooking == false && q.IsCanceled == false &&
               q.IsPending == false).ToList();
                foreach (BookingReceipt boo in lstBooking)
                {
                    item2.money = (item2.money + boo.RentalPrice);
                }

                lstBooking = serviceBooking.Get(q => q.GarageID == item.ID && q.IsSelfBooking == false && q.IsCanceled == false &&
                q.IsPending == false && q.EndTime < lastMonth).ToList();
                foreach (BookingReceipt boo in lstBooking)
                {
                    item2.compare = (item2.compare + boo.RentalPrice);
                }
                item2.car = serviceCar.Get(q => q.GarageID == item.ID).ToList().Count();
                item2.owner = item.AspNetUser.UserName;
                item2.status = item.IsActive;
                listGarage.Add(item2);
            }
            return Json(new { aaData = listGarage }, JsonRequestBehavior.AllowGet);
        }
    }
}