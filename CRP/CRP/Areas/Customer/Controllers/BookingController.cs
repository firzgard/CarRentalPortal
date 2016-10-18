using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Customer.Controllers
{
	public class BookingController : BaseController
	{
        //luu lai ID cua booking vua luu xuong databse
        private int lastBooking;
        //trong thoi gian 5 phut nen booking da duoc xoa thi ko chay luong
        private Boolean DeleteBookingThread = false;
        // Route to bookingConfirm page (Page for confirming booking details before paying)
        [System.Web.Mvc.Route("bookingConfirm")]
        public async System.Threading.Tasks.Task<ViewResult> BookingConfirm(BookingReceiptViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.View(model);
            }
            model.IsPending = true;
            var service = this.Service<IBookingReceiptService>();
            var entity = this.Mapper.Map<BookingReceipt>(model);
            //luu booking xuong database, nhung 
            await service.CreateAsync(entity);
            lastBooking = entity.ID;
            //goi api thanh toan, neu ok, thi xet ispending = false, +
            //sau 5 phut kiem tra neu ispending = false thi ko co gi, con is peding = true thi delete booking va return message overtime
            checkisPending(entity.ID);

            return View("~/Areas/CuopenTimeMonstomer/Views/Booking/BookingHistory.cshtml");
        }
        private void checkisPending(int bookingID)
        {
            Thread aNewThread = new Thread(
                () => deleteBooking(bookingID));
            aNewThread.Start();
        }
        //cho nay nen return json, de xu ly
        private void deleteBooking(int bookingID)
        {
            
            TimeSpan span = new TimeSpan(0, 0, 5, 0);
            Thread.Sleep(span);
            if (DeleteBookingThread == true)
            {
                Thread.ResetAbort();
            } 
            else
            {
                var service = this.Service<IBookingReceiptService>();
                var entity = service.Get(bookingID);
                //neu ispending van bang true thi xoa booking do
                Boolean isDelete = entity.IsPending;
                if (isDelete)
                {
                    service.Delete(entity);
                }
                else
                {
                    Thread.ResetAbort();
                }
            } 
        }
        // Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
        [System.Web.Mvc.Route("bookingReceipt")]
		public ViewResult BookingReceipt()
		{

            var service = this.Service<IBookingReceiptService>();
            var entity = service.Get(lastBooking);
            //kiem tra xem da thanh toan thanh cong hay chua
            Boolean paySuccess = true;
            //xuong databse ispending = false neu thanh toan thanh cong, xoa booking neu no ko thanh cong
            //neu thanh toan thanh cong
            if (paySuccess)
            {
                entity.IsPending = false;
                service.Update(entity);
               //tra ve model cua entity booking moi nhat

            } else
            {
                service.Delete(entity);
                //stop stread sau 5p kiem tra
                DeleteBookingThread = true;
                ViewBag.ErrorForPayment = "Thanh toan khong thanh cong!";
            }
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingHistory page
		[System.Web.Mvc.Route("management/bookingHistory")]
		public ViewResult BookingHistory()
		{
            /*
            //Lay ID cua thang User hien hanh
            string userID = "1";
            //lay tat booking cua thang User hien hanh
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            lstBooking = _service.getByUser(userID);
            ViewBag.BookingList = lstBooking;*/
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

        [System.Web.Mvc.Route("api/BookingHistorys")]
        [System.Web.Mvc.HttpGet]
        public JsonResult GetBookingHistorypListAPI()
        {
            String customerID = User.Identity.GetUserId();
            var service = this.Service<IBookingReceiptService>();
            var list = service.GetBookingReceipt(customerID);
            DateTime now = System.DateTime.Now;
            foreach(BookingReceipt item in list)
            {
                if (item.EndTime < now)
                {
                    item.IsCanceled = true;
                }
            }
            var result = list.Select(q => new IConvertible[] {
                q.ID,
                q.VehicleName,
                q.StartTime,
                q.EndTime,
                q.IsCanceled,
                q.Star
            });
            return Json(new { aaData = result }, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("api/BookingHistorys/{id:int}")]
        [System.Web.Mvc.HttpGet]
        public JsonResult getBookingReceiptAPI(int id)
        {
            String customerID = User.Identity.GetUserId();
            var service = this.Service<IBookingReceiptService>();
            var list = service.Get(id);
            return Json(new { aaData = list }, JsonRequestBehavior.AllowGet);
        }
        /*
        // API route for getting this user's booking receipts
        // Pagination needed
        // Order by startTime, from newer to older
        [Route("api/bookings/{page:int?}")]
        [HttpGet]
        public JsonResult GetBookingReceiptAPI(int page = 1)
        {
            //lay id user
            string customerID = "1";
            //set cung 10 record la 1 page
            int numberPage = (int) Math.Ceiling((_service.getNumberPage(customerID))/10.0);
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            List<BookingReceiptModel> jsonBookings = new List<BookingReceiptModel>();
            //lay theo so record
            lstBooking = _service.getBookingOfUserWithRecord(customerID, page);
            foreach (BookingReceipt p in lstBooking)
            {
                BookingReceiptModel jsonBooking = new BookingReceiptModel();
                jsonBooking.ID = p.ID;
                jsonBooking.VehicleID = (int) p.VehicleID;
                jsonBooking.VehicleName = p.VehicleName;
                jsonBooking.BookingFee = p.BookingFee;
                jsonBooking.CustomerID = p.CustomerID;
                jsonBooking.Comment = p.Comment;
                jsonBooking.GarageAddress = p.GarageAddress;
                jsonBooking.GarageName = p.GarageName;
                jsonBooking.IsCanceled = p.IsCanceled;
                jsonBooking.Star = p.Star.GetValueOrDefault();
                jsonBooking.TotalPrice = p.RentalPrice;
                jsonBooking.StartTime = p.StartTime;
                jsonBooking.EndTime = p.EndTime;
                jsonBooking.numberPage = numberPage;
                jsonBookings.Add(jsonBooking);
            }
            return Json(jsonBookings, JsonRequestBehavior.AllowGet);
        }

        // API route for getting booking calendar of this vehicle
        // Only get bookingReceipt of the next 30 days from this moment
        [Route("api/bookings/calendar/{vehicleID:int}")]
		[HttpGet]
		public JsonResult GetBookingCalendarAPI(int vehicleID)
		{
            checkisPending(6);
            List<BookingReceipt> booking = _service.findByVehicle(vehicleID);
            List<VehicleCalendarModel> jsonBookings = new List<VehicleCalendarModel>();
            foreach (BookingReceipt p in booking)
            {
                VehicleCalendarModel jsonBooking = new VehicleCalendarModel();
                jsonBooking.ID = p.ID;
                jsonBooking.StartTime = p.StartTime;
                jsonBooking.EndTime = p.EndTime;
                jsonBookings.Add(jsonBooking);
            }
            return Json(jsonBookings, JsonRequestBehavior.AllowGet);
		}
        */

        // API route for canceling a booking
        [System.Web.Mvc.Route("api/bookings/{id:int}")]
		[System.Web.Mvc.HttpDelete]
		public System.Web.Mvc.ActionResult CancelBookingAPI(int id)
		{
			var customerID = User.Identity.GetUserId();

			var service = this.Service<IBookingReceiptService>();
			var status = service.CancelBooking(customerID, id);
            
            switch (status)
            {
				case 0:
					return new HttpStatusCodeResult(200, "Booking canceled successfully.");
				case 1:
		            return new HttpNotFoundResult();
	            case 2:
		            return new HttpStatusCodeResult(403, "This booking has already been completed.");
            }
			return new HttpStatusCodeResult(500, "Internal server error.");
		}

		// API route for sending comment/rating for a booking
		[System.Web.Mvc.Route("api/bookings/{id:int}")]
		[System.Web.Mvc.HttpPatch]
		public System.Web.Mvc.ActionResult RateBookingAPI([FromBody] BookingCommentModel commentModel)
		{
			var customerID = User.Identity.GetUserId();

			var service = this.Service<IBookingReceiptService>();
			var status = service.RateBooking(customerID, commentModel);

			switch (status)
			{
				case 0:
					return new HttpStatusCodeResult(200, "Booking rated successfully.");
				case 1:
					return new HttpNotFoundResult();
				case 2:
					return new HttpStatusCodeResult(403, "This booking has not been completed.");
				case 3:
					return new HttpStatusCodeResult(403, "This booking has already been commented.");
			}
			return new HttpStatusCodeResult(500, "Internal server error.");
		}
	}
}