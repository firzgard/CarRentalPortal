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
            // Get all available booking receipt
            var bookings = repository.Get(b => b.ProviderID == conditions.providerID
                && b.IsPending == false);

            if(conditions.garageID != null)
            {
                bookings = bookings.Where(b => b.GarageID == conditions.garageID);
            }

            // Exclude canceled receipt while IsCanceled is not checked
            if(!conditions.IsCanceled)
            {
                bookings = bookings.Where(b => b.IsCanceled == false);
            }

            // Exclude canceled receipt while IsSelfBooking is not checked
            if (!conditions.IsSelfBooking)
            {
                bookings = bookings.Where(b => b.IsSelfBooking == false);
            }

            if(conditions.IsInThePast != null)
            {
                DateTime now = DateTime.Now;
                // while only IsInThePast is checked
                if(conditions.IsInThePast == true)
                {
                    bookings = bookings.Where(b => b.StartTime < now);
                }
                // while only IsInFuture is checked
                else
                {
                    bookings = bookings.Where(b => b.StartTime >= now);
                }
            }

            var recordsTotal = bookings.Count();

            var result = bookings.ToList().Select(b => new BookingsRecordJsonModel(b));

            // Sort
            // Default sort
            if(conditions.OrderBy == null || nameof(BookingsRecordJsonModel.ID) == conditions.OrderBy)
            {
                result = result.OrderByDescending(r => r.EndTime);
            }
            else
            {
                // End time: future ---> past (positive direction)
                if(nameof(BookingsRecordJsonModel.EndTime) == conditions.OrderBy)
                {
                    result = conditions.IsDescendingOrder ? result.OrderBy(r => r.EndTime)
                        : result.OrderByDescending(r => r.EndTime);
                }
                else
                {
                    var sortingProp = typeof(BookingsRecordJsonModel).GetProperty(conditions.OrderBy);
                    result = conditions.IsDescendingOrder
                        ? result.OrderByDescending(r => sortingProp.GetValue(r))
                        : result.OrderBy(r => sortingProp.GetValue(r));
                }
            }

            // Paginate
            var filteredRecords = result.Count();
            if ((conditions.Page - 1) * conditions.RecordPerPage > filteredRecords)
            {
                conditions.Page = 1;
            }

            result = result.Skip((conditions.Page - 1) * conditions.RecordPerPage)
                    .Take(conditions.RecordPerPage);

            return new BookingsDataTablesJsonModel(result.ToList(), conditions.Draw, recordsTotal, filteredRecords);
        }

    }
}