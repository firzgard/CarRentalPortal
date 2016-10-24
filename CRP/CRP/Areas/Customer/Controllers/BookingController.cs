using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Web;
using System.Web.Mvc;
using API_NganLuong;
using Microsoft.AspNet.Identity.Owin;

namespace CRP.Areas.Customer.Controllers
{
	public class BookingController : BaseController
	{
		// API route to create a booking if possible
		[Authorize(Roles = "Customer")]
		[System.Web.Http.HttpPost]
		[System.Web.Mvc.Route("api/bookings", Name = "TryBookingAPI")]
		public System.Web.Mvc.ActionResult TryBookingAPI(BookingCreatingModel model)
		{
			// Check if vehicleID exists
			if (model.VehicleID == null)
				return new HttpStatusCodeResult(400, "Invalid vehicle id.");

			// Check if rentalType was specified
			if (model.RentalType == null)
				return new HttpStatusCodeResult(400, "No valid rental period specified.");

			// Check if startTime was specified and is valid
			if (model.StartTime < DateTime.Now.AddHours(Models.Constants.SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR)
					|| model.StartTime > DateTime.Now.AddDays(Models.Constants.LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY))
				return new HttpStatusCodeResult(400, "No valid rental period specified.");

			var vehicleService = this.Service<IVehicleService>();
			var vehicle = vehicleService.Get(v => v.ID == model.VehicleID.Value
																&& v.Garage.IsActive
																&& !v.Garage.IsDisabled
																&& v.VehicleGroup != null
																&& v.VehicleGroup.IsActive
				).FirstOrDefault();

			// Check if vehicle exists
			if (vehicle == null)
				return new HttpStatusCodeResult(400, "Invalid vehicle id.");

			// Deduce the endtime / priceGroupItem based on acquired model
			DateTime endTime;
			PriceGroupItem priceGroupItem = null;
			if (model.RentalType.Value == 0)
			{
				// Check if numOfDay exists and is valid 
				if (model.NumOfDay == null || model.NumOfDay < 1 || model.NumOfDay > vehicle.VehicleGroup.PriceGroup.MaxRentalPeriod)
					return new HttpStatusCodeResult(400, "No valid rental period specified.");

				endTime = model.StartTime.AddDays(model.NumOfDay.Value);
			}
			else
			{
				// Check if priceGroupItem exists
				priceGroupItem = vehicle.VehicleGroup.PriceGroup.PriceGroupItems.FirstOrDefault(r => r.MaxTime != model.RentalType.Value);
				if (priceGroupItem == null)
					return new HttpStatusCodeResult(400, "No valid rental period specified.");

				endTime = model.StartTime.AddHours(model.RentalType.Value);
			}

			if (!vehicleService.CheckVehicleAvailability(model.VehicleID.Value, model.StartTime, endTime))
				return new HttpStatusCodeResult(403, "Cannot book this vehicle in this period");


			// All validation passed. Create new receipt with isPending = true
			var bookingService = this.Service<IBookingReceiptService>();
			var newBooking = this.Mapper.Map<BookingReceipt>(vehicle);
			newBooking.ID = 0;
			newBooking.CustomerID = User.Identity.GetUserId();
			newBooking.ProviderID = vehicle.Garage.AspNetUser.Id;
			newBooking.VehicleID = vehicle.ID;

			newBooking.GaragePhone = vehicle.Garage.Phone1;
			newBooking.VehicleName = vehicle.Name;
			newBooking.Star = null;

			newBooking.StartTime = model.StartTime;
			newBooking.EndTime = endTime;

			newBooking.IsPending = true;

			if (model.RentalType.Value == 0)
			{
				newBooking.RentalPrice = vehicle.VehicleGroup.PriceGroup.PerDayPrice * model.NumOfDay.Value;
			}
			else
			{
				newBooking.RentalPrice = priceGroupItem.Price;
			}

			newBooking.Deposit = newBooking.RentalPrice * (double)vehicle.VehicleGroup.PriceGroup.DepositPercentage;
			newBooking.BookingFee = newBooking.RentalPrice * Models.Constants.BOOKING_FEE_PERCENTAGE;

			bookingService.Create(newBooking);

			// Set timer to delete the booking if it is still pending after x-milisec
			System.Timers.Timer checkPendingBookingTimer = new System.Timers.Timer(30000);
			checkPendingBookingTimer.AutoReset = false;

			// Add callback
			checkPendingBookingTimer.Elapsed += delegate { CheckPendingBooking(newBooking.ID); };
			checkPendingBookingTimer.Start();

			//return View("~/Areas/Customer/Views/Booking/BookingConfirm.cshtml", entity);
			return JavaScript("window.location = '/bookingConfirm/" + newBooking.ID + "'");
		}

		// Handler for TryBookingApi
		private void CheckPendingBooking(int bookingID)
		{
			var bookingReceipt = this.Service<IBookingReceiptService>().Get(bookingID);


		}

		// Route to bookingConfirm page (Page for confirming booking details before paying)
		[Authorize(Roles = "Customer")]
		[System.Web.Http.HttpPost]
		[System.Web.Mvc.Route("bookingConfirm/{bookingID}", Name = "BookingConfirm")]
		public System.Web.Mvc.ActionResult BookingConfirm(int bookingID)
		{
			return View();
		}

		////cho nay nen return json, de xu ly
		//private void deleteBooking(int bookingID)
		//{
		//	TimeSpan span = new TimeSpan(0, 0, 5, 0);
		//	Thread.Sleep(span);
		//	if (DeleteBookingThread == true)
		//	{
		//		Thread.ResetAbort();
		//	} 
		//	else
		//	{
		//		var service = this.Service<IBookingReceiptService>();
		//		var entity = service.Get(bookingID);
		//		//neu ispending van bang true thi xoa booking do
		//		Boolean isDelete = entity.IsPending;
		//		if (isDelete)
		//		{
		//			service.Delete(entity);
		//		}
		//		else
		//		{
		//			Thread.ResetAbort();
		//		}
		//	} 
		//}

		// Route for paying with nganluong)
		[Authorize(Roles = "Customer")]
		[System.Web.Http.HttpPost]
		[Microsoft.AspNetCore.Mvc.Route("bookingConfirm")]
		public System.Web.Mvc.ActionResult BookVehicle(NganLuongBookingModel BookingModel)
		{
			var info = new RequestInfoTemplate
			{
				bank_code = BookingModel.BankCode,
				Order_code = BookingModel.OrderCode,
				order_description = "Test booking",
				return_url = "http://localhost/65358/bookingReceipt",
				cancel_url = "http://localhost/65358"
			};

			var user = HttpContext.GetOwinContext()
					.GetUserManager<ApplicationUserManager>()
					.FindById(HttpContext.User.Identity.GetUserId());

			info.Buyer_fullname = user.FullName;
			info.Buyer_email = user.Email;
			info.Buyer_mobile = user.PhoneNumber;

			var objNLChecout = new APICheckoutV3();
			var result = objNLChecout.GetUrlCheckout(info, BookingModel.PaymentMethod);

			if (result.Error_code == "00")
			{
				return JavaScript("window.location = '" + result.Checkout_url + "'");
			}

			return new HttpStatusCodeResult(400, "Invalid request");
		}

		// Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
		//[System.Web.Mvc.Route("bookingReceipt")]
		//public async Task<ViewResult> BookingReceipt()
		//{
			//SystemService sysService = new SystemService();
			//lastBooking = 1;
			//var service = this.Service<IBookingReceiptService>();
			//var entity = await service.GetAsync(lastBooking);
			////kiem tra xem da thanh toan thanh cong hay chua
			//Boolean paySuccess = true;
			////xuong databse ispending = false neu thanh toan thanh cong, xoa booking neu no ko thanh cong
			////neu thanh toan thanh cong
			//if (paySuccess)
			//{
			//    entity.IsPending = false;
			//    service.Update(entity);
			//   //tra ve model cua entity booking moi nhat

			//} else
			//{
			//    service.Delete(entity);
			//    //stop stread sau 5p kiem tra
			//    DeleteBookingThread = true;
			//    ViewBag.ErrorForPayment = "Thanh toan khong thanh cong!";
			//}

			//send mail bao cho Provider va Customer
			//sysService.SendMailBooking("tamntse61384@fpt.edu.vn", entity);
			//sysService.SendMailBooking(entity.AspNetUser11.Email, entity);

			//return View("~/Areas/Customer/Views/Booking/BookingReceipt.cshtml", entity);
		//}


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
			var list = service.GetBookingReceiptWithUser(customerID);
			DateTime now = System.DateTime.Now;
			foreach(BookingReceipt item in list.ToList())
			{
				if (item.EndTime < now)
				{
					item.IsCanceled = true;
				}
				if (item.IsSelfBooking == true)
				{
					list.Remove(item);
				}
			}
			var result = list.Select(q => new IConvertible[] {
				q.ID,
				q.VehicleName,
				q.StartTime,
				q.EndTime,
				q.IsCanceled,
				q.Star,
				q.RentalPrice,
				q.BookingFee,
				q.GarageName,
				q.GarageAddress,
				q.Color,
				q.VehicleModel.Name,
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

		[System.Web.Mvc.Route("api/booking/status/{id:int}")]
		[System.Web.Mvc.HttpDelete]
		public async Task<JsonResult> ChangeStatus(int id)
		{
			var service = this.Service<IBookingReceiptService>();
			var entity = await service.GetAsync(id);
			if (entity != null)
			{
				entity.IsCanceled = !entity.IsCanceled;
				await service.UpdateAsync(entity);
				return Json(new { result = true, message = "Change status success!" });
			}

			return Json(new { result = false, message = "Change status failed!" });
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
		[System.Web.Mvc.Route("api/CommentBooking")]
		[System.Web.Mvc.HttpPost]
		public async Task<JsonResult> EditPC()
		{
			SystemService sysService = new SystemService();
			int id = int.Parse(Request.Params["id"]);
			String comment = Request.Params["comment"];
			decimal star = decimal.Parse(Request.Params["star"]);
			var service = this.Service<IBookingReceiptService>();
			var entity = await service.GetAsync(id);
			if (entity != null)
			{
				entity.Comment = comment;
				entity.Star = star;
				await service.UpdateAsync(entity);
				//update ratng cho garage va vihicle tuong ung
				sysService.UpdateRatingGarage(entity.GarageID.GetValueOrDefault());
				sysService.UpdateRatingVehicle(entity.VehicleID.GetValueOrDefault());
				return Json(new { result = true, message = "Change status success!" });
			}
			return Json(new { result = false, message = "Change status failed!" });
		}
	}
}