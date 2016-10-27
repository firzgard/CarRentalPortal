using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;
using Microsoft.AspNet.Identity;
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
            DateTime today = DateTime.Now;
            var providerID = User.Identity.GetUserId();
            var GarageService = this.Service<IGarageService>();
            var CarService = this.Service<IVehicleService>();
            var BookingService = this.Service<IBookingReceiptService>();
            var UserService = this.Service<IUserReceiptService>();
            AspNetUser UserEntity = UserService.Get(q => q.Id == providerID).FirstOrDefault();
            var listGara = GarageService.Get(q => q.OwnerID == providerID).ToList();
            var listComment = new List<CommentModel>();
            var listBooking = new List<BookingReceipt>();
            var comment = new CommentModel();
            ProviderReportViewModel model = new ProviderReportViewModel();
            model.ID = providerID;
            model.ProviderName = UserEntity.UserName;
            listBooking = BookingService.Get(q => q.AspNetUser1.Id == providerID && q.IsSelfBooking == false && q.IsCanceled == false &&
                q.IsPending == false).ToList();
            foreach (BookingReceipt item in listBooking)
            {
                model.money = model.money + item.RentalPrice;
                model.booking = + 1;
            }
            listBooking = BookingService.Get(q => q.AspNetUser1.Id == providerID && q.IsSelfBooking == false &&
               q.IsPending == false).OrderByDescending(q => q.ID).Take(3).ToList();
            foreach (BookingReceipt item3 in listBooking)
            {
                comment.UserName = item3.AspNetUser.UserName;
                comment.Comment = item3.Comment;
                comment.star = item3.Star.GetValueOrDefault();
                listComment.Add(comment);
            }
            model.car = CarService.Get(q => q.Garage.AspNetUser.Id == providerID).ToList().Count();
            model.providerUtil = UserEntity.IsProviderUntil.ToString();
            model.comment = listComment;
            return View("~/Areas/Provider/Views/DashBoard/Index.cshtml", model);
        }
        //test
        [Route("api/getProviderData1")]
        [HttpGet]
        public ActionResult GetTestData()
        {
            DateTime today = DateTime.Now;
            var providerID = User.Identity.GetUserId();
            var BookingService = this.Service<IBookingReceiptService>();
            var listBooking = new List<BookingReceipt>();
            var listReportMoney = new List<ReportMoneyViewModel>();
            var period = 0;
            for (int i =1; i <= today.Month; i++)
            {
                period = today.Month - i;
                ReportMoneyViewModel model = new ReportMoneyViewModel();
                YearMonthModel Time = new YearMonthModel();
                Time.Month = i;
                Time.Year = today.Year;
                model.Time = Time;
                model.Money = period * 10010;
                //test
                //listBooking = BookingService.Get(q => q.EndTime < today.AddMonths(-period)).ToList();
                listReportMoney.Add(model);
            }
            return Json(new { aaData = listReportMoney }, JsonRequestBehavior.AllowGet);
        }
    }
}