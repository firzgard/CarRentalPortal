using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRP.Models.Entities.Repositories;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Models.Entities.Services
{
	public class VehicleService
	{
		VehicleRepository _repository = new VehicleRepository();
		public Boolean add(Vehicle vehicle)
		{
			try
			{
				_repository.Add(vehicle);
			}
			catch (Exception e)
			{
				e.GetHashCode();
				return false;
			}
			return true;
		}

		public Boolean delete(int ID)
		{
			Vehicle deleteVehicle = _repository.findById(ID);
			if (deleteVehicle == null)
			{
				return false;
			}
			else
			{
				try
				{
					_repository.Delete(deleteVehicle);
				}
				catch (Exception e)
				{
					e.GetHashCode();
					return false;
				}
				return true;
			}
		}

		public List<Vehicle> getAll()
		{
			List<Vehicle> lstVehicle = new List<Vehicle>();
			lstVehicle = _repository.getList();
			return lstVehicle;
		}
		public Boolean UpdateVehicle(Vehicle vehicle)
		{
			Vehicle sVehicle = _repository.findById(vehicle.ID);
			if (sVehicle == null)
			{
				return false;
			}
			try
			{
				_repository.Update(vehicle);
			}
			catch (Exception e)
			{
				e.GetBaseException();
				return false;
			}
			return true;
		}
		public Vehicle findByID(int ID)
		{
			Vehicle vehilce = _repository.findById(ID);
			return vehilce;
		}

		public List<SearchResultJSONVModel> findToBook(SearchConditionModel searchConditions)
		{
			_repository.findToBook(searchConditions);
			return null;
		}

	}
}