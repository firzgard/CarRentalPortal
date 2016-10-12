using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public interface IGarageRepository : IRepository<Garage>
    {

    }

    public class GarageRepository : BaseRepository<Garage>, IGarageRepository
    {
        public GarageRepository(CRPEntities dbContext) : base(dbContext)
        {
        }
    }




    //   public class GarageRepository
    //{
    //	CRPEntities _dataContext = new CRPEntities();


    //       public List<Garage> findByUser(AspNetUser userID)
    //       {
    //           var query = (from r in _dataContext.Garages where r.AspNetUser == userID select r).ToList();
    //           return query;
    //       }
    //   }
}