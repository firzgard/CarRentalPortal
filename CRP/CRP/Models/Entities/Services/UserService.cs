using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public interface IUserReceiptService : IService<AspNetUser>
    {

    }
    public class UserService : BaseService<AspNetUser>, IUserReceiptService
	{
        public UserService(IUnitOfWork unitOfWork, IUserReceiptService repository) : base(unitOfWork, repository)
        {

        }

        public UserService()
        {
        }

        public AspNetUser findUserByEmail(String email)
        {
            var UserList = this.repository.Get();
            AspNetUser user = UserList
                .Where(q => q.Email == email)
                .FirstOrDefault();
            return user;
        }
        public void Create(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public Task CreateAsync(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public void DeActivate(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public Task DeActivateAsync(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public IQueryable<BookingReceipt> Get(Expression<Func<BookingReceipt, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public void OnCreate(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public void Update(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(BookingReceipt entity)
        {
            throw new NotImplementedException();
        }
    }
}