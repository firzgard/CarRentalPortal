using CRP.Models.Entities.Repositories;
using CRP.Models.JsonModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRP.Models.ViewModels;

namespace CRP.Models.Entities.Services
{
	public interface IBookingReceiptService : IService<BookingReceipt>
	{
		BookingReceiptModel GetBookingHistory(string customerID, int page, int recordPerPage);
        List<BookingReceipt> GetBookingReceipt(string customerID);

        int CancelBooking(string customerID, int bookingID);
		int RateBooking(string customerID, BookingCommentModel commentModel);
        BookingsDataTablesJsonModel FilterBookings(BookingsFilterConditions conditions);
    }
	public class BookingReceiptService : BaseService<BookingReceipt>, IBookingReceiptService
	{
		public BookingReceiptService(IUnitOfWork unitOfWork, IBookingReceiptRepository repository) : base(unitOfWork, repository)
		{

		}

		public BookingReceiptModel GetBookingHistory(string customerID, int page, int recordPerPage)
		{
			BookingReceiptModel bookingModel = new BookingReceiptModel();
			var bookingRecieptList = this.repository.Get();
			List<BookingReceipt> lstBooking = bookingRecieptList
				.Where(q => q.CustomerID == customerID)
				.OrderByDescending(q => q.ID)
				.Skip((page - 1) * recordPerPage)
				.Take(recordPerPage)
				.ToList();

			bookingModel.listReceipt.AddRange(lstBooking);
			bookingModel.numberPage = (int) Math.Ceiling( bookingRecieptList.Count() / (recordPerPage * 1.0));

			return bookingModel;
		}

        public List<BookingReceipt> GetBookingReceipt(string customerID)
        {
            var bookingReceiptList = this.repository.Get();
            List<BookingReceipt> lstBooking = bookingReceiptList
                 .Where(q => q.CustomerID == customerID)
                 .OrderByDescending(q => q.ID)
                 .ToList();
            return lstBooking;
        }

        public int CancelBooking(string customerID, int bookingID)
        {
            BookingReceipt receipt = this.repository.Get(br => br.CustomerID == customerID && br.ID == bookingID).FirstOrDefault();
            if (receipt == null)
            {
                return 1;
            }
            // Do not allow canceling a booking that has already ended
            if (receipt.EndTime < DateTime.Now)
            {
                return 2;
            }
            Boolean cc = receipt.IsCanceled;
            receipt.IsCanceled = true;
            receipt.IsCanceled = true;
            repository.Update(receipt);
            return 0;
        }

        public int RateBooking(string customerID, BookingCommentModel commentModel)
		{
			var receipt = repository.Get(v => v.CustomerID == customerID && v.ID == commentModel.ID).FirstOrDefault();

			if (receipt == null)
				return 1;

			if (!receipt.IsCanceled || receipt.EndTime < DateTime.Now)
				return 2;

			if (receipt.Comment != null || receipt.Star != null)
				return 3;

			receipt.Comment = commentModel.Comment;
			receipt.Star = commentModel.Star;

			// Need help on how to update star of vehicle and garage here

			repository.Update(receipt);

			return 0;
		}

        public BookingsDataTablesJsonModel FilterBookings(BookingsFilterConditions conditions)
        {
            var bookings = repository.Get(b => b.Vehicle.GarageID == conditions.garageID
                && b.AspNetUser.Id == conditions.providerID && b.CustomerID != conditions.providerID
                && b.IsPending == false);
            
        }

    }
}