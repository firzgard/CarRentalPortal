using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Timers;
using System.Threading;

namespace CRP.Areas.Customer.Controllers
{
	public class BookingController : Controller
	{
        BookingService _service = new BookingService();
		// Route to bookingConfirm page (Page for confirming booking details before paying)
		[Route("bookingConfirm")]
		public ViewResult BookingConfirm()
		{
            //dau moa chua ro xu ly sao, chua lam
            string CustomerID = Request.Params["UserID"];
            int VehicleID = int.Parse(Request.Params["VehicleID"]);
            //can 1 api de xu ly ca totalprice
            float TotalPrice = float.Parse(Request.Params["TotalPrice"]);
            float BookingFee = float.Parse(Request.Params["BookingFee"]);
            string VehicleName = Request.Params["VehicleName"];
            string GarageName = Request.Params["GarageName"];
            string GarageAddress = Request.Params["GarageAddress"];
            DateTime StartTime = DateTime.Parse(Request.Params["StartTime"]);
            DateTime EndTime = DateTime.Parse(Request.Params["EndTime"]);

            BookingReceipt booking = new BookingReceipt();
            booking.CustomerID = CustomerID;
            booking.VehicleID = VehicleID;
            booking.RentalPrice = TotalPrice;
            booking.BookingFee = BookingFee;
            booking.VehicleName = VehicleName;
            booking.GarageName = GarageName;
            booking.GarageAddress = GarageAddress;
            booking.StartTime = StartTime;
            booking.EndTime = EndTime;
            booking.IsPending = true;
            //luu xuoong database
            int bookingID = _service.addwithPending(booking);
            //goi api thanh toan, neu ok, thi xet ispending = false, +

            //sau 5 phut kiem tra neu ispending = false thi ko co gi, con is peding = true thi delete booking va return message overtime
            checkisPending(bookingID);
            
            return View("~/Areas/CuopenTimeMonstomer/Views/Booking/BookingHistory.cshtml");
		}
        public void checkisPending(int bookingID)
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
            Boolean isDelete = _service.IsPending(bookingID);
            if (isDelete)
            {
                Boolean result = _service.delete(bookingID);
            } else
            {
                Thread.ResetAbort();
            }
        }
        // Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
        [Route("bookingReceipt")]
		public ViewResult BookingReceipt()
		{
            //lay thong tin booking moi nhat cua thang user
            string CustomerID = "1";
            BookingReceipt lastBooking = _service.getLastBooking(CustomerID);
            //khi addBooking thi xuat ra ID
            Boolean paySuccess = true;
            //xuong databse ispending = false neu thanh toan thanh cong, xoa booking neu no ko thanh cong
            ViewBag.BookingReceipt = lastBooking;
            //neu thanh toan thanh cong
            if (paySuccess)
            {
                lastBooking.IsPending = false;
                _service.Update(lastBooking);
                ViewBag.BookingReceipt = lastBooking;
            } else
            {
                _service.delete(lastBooking.ID);
                ViewBag.ErrorForPayment = "Thanh toan khong thanh cong!";
            }
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingHistory page
		[Route("management/bookingHistory")]
		public ViewResult BookingHistory()
		{
            //
            //Lay ID cua thang User hien hanh
            string userID = "1";
            //lay tat booking cua thang User hien hanh
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            lstBooking = _service.getByUser(userID);
            ViewBag.BookingList = lstBooking;
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

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

		// API route for canceling a booking
		[Route("api/bookings/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
            MessageJsonModel jsonResult = new MessageJsonModel();
            Boolean result = _service.cancleBooking(id);
            if (result)
            {
                jsonResult.Status = 1;
                jsonResult.Message = "Cancle successfully!";
            }
            else
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API route for sending comment/rating for a booking
		[Route("api/bookings/{id:int}")]
		[HttpPut]
		public JsonResult RateBookingAPI(int id)
		{
			//comment xong co can cancle va set dateend lun ko?
			MessageJsonModel jsonResult = new MessageJsonModel();
            string comment = Request.Params["comment"];
            //cach tinh star cho vehicle hay cho Provider?
            decimal Star = decimal.Parse(Request.Params["star"]);
            BookingReceipt booking = _service.findByID(id);
            booking.Comment = comment;
            booking.Star = Star;
            Boolean result = _service.rateForBooking(booking);
            if (result)
            {
                jsonResult.Status = 1;
                jsonResult.Message = "Rate successfully!";
            }
            else
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
	}
}