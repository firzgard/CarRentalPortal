using CRP.Models.Entities.Repositories;
using CRP.Models.JsonModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public interface IBookingReceiptService : IService<BookingReceipt>
	{
		BookingReceiptModel GetBookingHistory(string customerID, int page, int recordPerPage);

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
	}
}