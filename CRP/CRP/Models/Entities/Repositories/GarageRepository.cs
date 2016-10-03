using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public class GarageRepository : BaseRepository<Garage>
	{
		CRPEntities _dataContext = new CRPEntities();
		public IEnumerable<Garage> List
		{
			get
			{
				throw new NotImplementedException();
			}
		}
		public List<Garage> getAllGarage()
		{
			List<Garage> lstGarage = _dataContext.Garages.ToList<Garage>();
			return lstGarage;
		}
		public void Add(Garage entity)
		{
			_dataContext.Garages.Add(entity);
			_dataContext.SaveChanges();
		}

		public void Delete(Garage entity)
		{
			_dataContext.Garages.Remove(entity);
			_dataContext.SaveChanges();
		}

		public Garage findById(int Id)
		{
			var query = (from r in _dataContext.Garages where r.ID == Id select r).FirstOrDefault();
			return query;
		}

		public void Update(Garage entity)
		{
			_dataContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
			_dataContext.SaveChanges();
		}
		public Boolean doActive(Garage entity)
		{
			try
			{
				if (entity.IsActive == false)
				{
					entity.IsActive = true;
				}
				else
				{
					entity.IsActive = false;
				}
				_dataContext.SaveChanges();
			}
			catch (Exception e)
			{
				return false;
			}
			return true;
		}
	}
}