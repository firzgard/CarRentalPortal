using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Models.Entities.Repositories
{
	public class VehicleRepository : IBaseRepository<Vehicle>
	{
		CRPEntities _dataContext = new CRPEntities();
		public IEnumerable<Vehicle> List
		{
			get
			{
				throw new NotImplementedException();
			}
		}
		public List<Vehicle> getAll()
		{
			List<Vehicle> lstVehicle = _dataContext.Vehicles.ToList<Vehicle>();
			return lstVehicle;
		}
		public void Add(Vehicle entity)
		{
			_dataContext.Vehicles.Add(entity);
			_dataContext.SaveChanges();
		}

		public void Delete(Vehicle entity)
		{
			_dataContext.Vehicles.Remove(entity);
			_dataContext.SaveChanges();
		}

		public Vehicle findById(int Id)
		{
			var query = (from r in _dataContext.Vehicles where r.ID == Id select r).FirstOrDefault();
			return query;
		}

		public void Update(Vehicle entity)
		{
			_dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
			_dataContext.SaveChanges();
		}
	}
}