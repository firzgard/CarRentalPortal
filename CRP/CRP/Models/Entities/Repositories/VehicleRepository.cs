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
		public List<Vehicle> getAllGarage()
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

		internal List<Vehicle> getList()
		{
			throw new NotImplementedException();
		}

		public List<SearchResultJSONVModel> findToBook(SearchConditionModel searchConditions)
		{
			var query = (from vehicle in _dataContext.Vehicles
						 where (( searchConditions.BrandIDList != null
										&& searchConditions.BrandIDList.Contains<int>(vehicle.Model.BrandID) )
									|| (searchConditions.ModelIDList != null
										&& searchConditions.ModelIDList.Contains<int>(vehicle.ModelID) ))
								&& ( searchConditions.LocationID != null
									&& searchConditions.LocationID == vehicle.Garage.LocationID )
								&& ( searchConditions.VehicleTypeList != null 
									&& searchConditions.VehicleTypeList.Contains<int>(vehicle.Model.Type) )
						select new SearchResultJSONVModel(vehicle)
					).ToList<SearchResultJSONVModel>();

			return query;
		}

	}
}