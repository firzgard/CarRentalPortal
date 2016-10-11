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

    }
    public class BookingReceiptService : BaseService<BookingReceipt>, IBookingReceiptService
    {
        public BookingReceiptService(IUnitOfWork unitOfWork, IBookingReceiptRepository repository) : base(unitOfWork, repository)
        {

        }
        // Check to see if the vehicle is available
        public Boolean CheckVehicleAvailability(int vehicleID, DateTime startTime, DateTime endTime)
        {
            var bookingReceiptList = this.repository.Get();
            var list = bookingReceiptList
                .Where(q => (q.VehicleID == vehicleID) &&((startTime > q.StartTime && startTime < q.EndTime)
                || (endTime > q.StartTime && endTime < q.EndTime)
                || (startTime <= q.StartTime && endTime >= q.EndTime)) );
            return list.Count() == 0;
        }
        public BookingReceiptModel GetBookingHistory(int customerID, int page, int recordPerPage)
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