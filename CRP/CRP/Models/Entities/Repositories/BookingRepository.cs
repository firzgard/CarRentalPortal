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

        public void Update(BookingReceipt entity)
        {
            _dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            _dataContext.SaveChanges();
        }
    }
}