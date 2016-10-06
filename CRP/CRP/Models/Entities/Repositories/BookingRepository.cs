using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public class BookingRepository : IBaseRepository<BookingReceipt>
	{
		CRPEntities _dataContext = new CRPEntities();
		public IEnumerable<BookingReceipt> List
		{
			get
			{
				throw new NotImplementedException();
			}
		}

		public List<BookingReceipt> getAll()
		{
			List<BookingReceipt> lstBooking = _dataContext.BookingReceipts.ToList<BookingReceipt>();
			return lstBooking;
		}
		public void Add(BookingReceipt entity)
		{
			_dataContext.BookingReceipts.Add(entity);
			_dataContext.SaveChanges();
		}

		public void Delete(BookingReceipt entity)
		{
			_dataContext.BookingReceipts.Remove(entity);
			_dataContext.SaveChanges();
		}

		public BookingReceipt findById(int Id)
		{
			var query = (from r in _dataContext.BookingReceipts where r.ID == Id select r).FirstOrDefault();
			return query;
		}

		public List<BookingReceipt> findByVehicleID(int vehicleID)
		{
			var query = (from r in _dataContext.BookingReceipts where r.VehicleID == vehicleID select r).ToList<BookingReceipt>();
			return query;
		}

		public List<BookingReceipt> findBookingOfVehicleInPeriod(int vehicleID, DateTime startTime, DateTime endTime)
		{
			var query = (from r
						 in _dataContext.BookingReceipts
						 where r.VehicleID == vehicleID
							&& ((startTime > r.StartTime && startTime < r.EndTime)
								|| (endTime > r.StartTime && endTime < r.EndTime)
								|| (startTime <= r.StartTime && endTime >= r.EndTime))
						 orderby r.StartTime
						 select r
						 ).ToList<BookingReceipt>();
			return query;
		}

		public void Update(BookingReceipt entity)
		{
			_dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
			_dataContext.SaveChanges();
		}
		public List<BookingReceipt> getByUser(int userID)
		{
			var query = (from r in _dataContext.BookingReceipts where r.CustomerID == userID select r).ToList<BookingReceipt>();
			return query;
		}
		public List<BookingReceipt> getByVehicle(int vehicleID)
		{
			var query = (from r in _dataContext.BookingReceipts where r.VehicleID == vehicleID select r).ToList<BookingReceipt>();
			return query;
		}
		
		public List<BookingReceipt> getBookingOfUserWithRecord(int customerID, int record)
		{
			var query = (from r in _dataContext.BookingReceipts where r.CustomerID == customerID orderby r.ID descending select r).Skip((record - 1) * 10).Take(10).ToList<BookingReceipt>();
			return query;
		}

		//getNumberPAge
		public int getNumberPage(int customerID)
		{
			var query = (from r in _dataContext.BookingReceipts where r.CustomerID == customerID select r).Count();
			return query;
		}

		//chua chac
		public BookingReceipt getLastBooking(int vehicleID)
		{
			var query = (from r in _dataContext.BookingReceipts where r.VehicleID == vehicleID select r).FirstOrDefault();
			return query;
		}
	}
}