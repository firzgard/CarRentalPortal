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
			lstVehicle = _repository.getAll();
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

		public SearchResultJsonModel findToBook(SearchConditionModel searchConditions)
		{
			// Get all vehicles
			List<Vehicle> vehicles = _repository.getAll();
			
			// Filters, go!!
			if (searchConditions.TransmissionTypeIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.TransmissionTypeIDList.Contains(v.TransmissionType)
				).ToList();

			if (searchConditions.NumberOfSeatList != null)
				vehicles = vehicles.Where(
					v => searchConditions.NumberOfSeatList.Contains(v.Model.NumOfSeat)
				).ToList();

			if (searchConditions.VehicleTypeList != null)
				vehicles = vehicles.Where(
					v => searchConditions.VehicleTypeList.Contains(v.Model.Type)
				).ToList();

			if (searchConditions.ColorIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.ColorIDList.Contains(v.Color)
				).ToList();

			if (searchConditions.FuelTypeIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.FuelTypeIDList.Contains(v.FuelType)
				).ToList();

			if (searchConditions.LocationIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.LocationIDList.Contains(v.Garage.LocationID))
				.ToList();

			if (searchConditions.BrandIDList != null || searchConditions.ModelIDList != null)
				vehicles = vehicles.Where(v => searchConditions.BrandIDList.Contains(v.Model.BrandID)
								|| searchConditions.ModelIDList.Contains(v.ModelID)).ToList();

			// Get the rental time in hour
			TimeSpan rentalTimeSpan = (DateTime)searchConditions.EndTime - (DateTime)searchConditions.StartTime;
			int rentalTime = (int)Math.Ceiling(rentalTimeSpan.TotalHours);

			vehicles = vehicles.Where(v => !(v.VehicleGroup.MaxRentalPeriod * 24 < rentalTime)).ToList();

			vehicles = vehicles.Where(v =>
			{
				bool isValid = true;
				foreach (BookingReceipt br in v.BookingReceipts)
				{
					if ((searchConditions.StartTime > br.StartTime
								&& searchConditions.StartTime < br.EndTime)
							|| (searchConditions.EndTime > br.StartTime
								&& searchConditions.EndTime < br.EndTime)
							|| (searchConditions.StartTime <= br.StartTime
								&& searchConditions.EndTime >= br.EndTime))
					{
						isValid = false;
						break;
					}
				}
				return isValid;
			}).ToList();

			// Parse into model suitable to send back to browser
			List<SearchResultVehicleJsonModel> results = new List<JsonModels.SearchResultVehicleJsonModel>();
			foreach(Vehicle vehicle in vehicles)
			{
				results.Add(new SearchResultVehicleJsonModel(vehicle, rentalTime));
			}

			if (searchConditions.MaxPrice != null && searchConditions.MinPrice != null
					&& searchConditions.MaxPrice > searchConditions.MinPrice)
			{
				results = results.Where(
					r => searchConditions.MaxPrice >= r.BestPossibleRentalPrice
						&& searchConditions.MinPrice <= r.BestPossibleRentalPrice
				).ToList();
			}

			// Paginate
			if ((searchConditions.Page - 1) * Constants.NumberOfSearchResultPerPage < results.Count)
				searchConditions.Page = 1;

			results = results.Skip((searchConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
					.Take(Constants.NumberOfSearchResultPerPage)
					.ToList();

			// Order
			System.Reflection.PropertyInfo info = typeof(SearchResultVehicleJsonModel).GetProperty(searchConditions.OrderBy);
			if (info != null)
				results = results.OrderBy(r => info.GetValue(r)).ToList();

			// Nest into result object
			return new SearchResultJsonModel(results, results.Count);
		}
	}
}