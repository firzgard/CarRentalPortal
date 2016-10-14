using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities.Repositories;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Models.Entities.Services
{
	public interface IVehicleService : IService<Vehicle>
	{
		SearchResultJsonModel SearchVehicle(SearchConditionModel filterConditions);
		VehicleDataTablesJsonModel FilterVehicle(VehicleManagementFilterConditionModel filterConditions);
	}

	public class VehicleService : BaseService<Vehicle>, IVehicleService
	{
		public VehicleService(IUnitOfWork unitOfWork, IVehicleRepository repository) : base(unitOfWork, repository)
		{

		}

		public SearchResultJsonModel SearchVehicle(SearchConditionModel filterConditions)
		{
			var vehicles = repository.Get();

			// Run basic common filters
			vehicles = BasicFilter(vehicles, filterConditions);

			// NumOfSeatList condition
			if (filterConditions.NumberOfSeatList != null)
				vehicles = vehicles.Where(v => filterConditions.NumberOfSeatList.Contains(v.Model.NumOfSeat));

			// Get the rental time in hour
			var rentalTimeSpan = (DateTime)filterConditions.EndTime - (DateTime)filterConditions.StartTime;
			var rentalTime = (int)Math.Ceiling(rentalTimeSpan.TotalHours);

			// vehicleGroup's max rental time constraint
			vehicles = vehicles.Where(v => v.VehicleGroup.MaxRentalPeriod == null
										|| v.VehicleGroup.MaxRentalPeriod * 24 > rentalTime);

			// get only vehicles that are free in the booking period condition
			vehicles = vehicles.Where(v =>
				!(v.BookingReceipts.Any(br => !br.IsCanceled
					&& (
						   (filterConditions.StartTime > br.StartTime && filterConditions.StartTime < br.EndTime)
						|| (filterConditions.EndTime > br.StartTime && filterConditions.EndTime < br.EndTime)
						|| (filterConditions.StartTime <= br.StartTime && filterConditions.EndTime >= br.EndTime)
					)))
			);

			// Check StartTime/EndTime to be within garage's OpenTime ~ CloseTime
			// Compare by convert time to the number of minute from 00:00
			// Max margin of error: 60 secs vs CloseTime (Because we do not validate to second)

			// Booking StartTime
			var startDayInDoW = (int) filterConditions.StartTime.Value.DayOfWeek;
			vehicles = vehicles.Where(v =>
				v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == startDayInDoW
							  && (filterConditions.StartTime.Value.Minute + filterConditions.StartTime.Value.Hour * 60) >= gwt.OpenTimeInMinute
							  && (filterConditions.StartTime.Value.Minute + filterConditions.StartTime.Value.Hour * 60) <= gwt.CloseTimeInMinute)
			);

			// Booking EndTime
			var endDayInDoW = (int) filterConditions.EndTime.Value.DayOfWeek;
			vehicles = vehicles.Where(v =>
				v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == endDayInDoW
							  && (filterConditions.EndTime.Value.Minute + filterConditions.EndTime.Value.Hour * 60) >= gwt.OpenTimeInMinute
							  && (filterConditions.EndTime.Value.Minute + filterConditions.EndTime.Value.Hour * 60) <= gwt.CloseTimeInMinute)
			);

			// Parse into model suitable to send back to browser
			var results = vehicles.ToList().Select(vehicle => new SearchResultItemJsonModel(vehicle, rentalTime)).ToList();

			// Max/Min Price conditions
			if (filterConditions.MaxPrice != null && filterConditions.MinPrice != null
					&& filterConditions.MaxPrice > filterConditions.MinPrice)
			{
				results = results.Where(
					r => filterConditions.MaxPrice >= r.BestPossibleRentalPrice
						&& filterConditions.MinPrice <= r.BestPossibleRentalPrice
				).ToList();
			}

			// Paginate
			var filteredRecords = results.Count;
			if (filterConditions.Page < 1 || (filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage > filteredRecords)
				filterConditions.Page = 1;

			results = results.Skip((filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
					.Take(Constants.NumberOfSearchResultPerPage)
					.ToList();

			// Order
			System.Reflection.PropertyInfo prop1 = typeof(SearchResultItemJsonModel).GetProperty(filterConditions.OrderBy);
			results = filterConditions.IsDescendingOrder
				? results.OrderByDescending(r => prop1.GetValue(r)).ToList()
				: results.OrderBy(r => prop1.GetValue(r)).ToList();

			// Nest into result object
			return new SearchResultJsonModel(results, filteredRecords);
		}

		public VehicleDataTablesJsonModel FilterVehicle(VehicleManagementFilterConditionModel filterConditions)
		{
			// Get only vehicles belonged to this user
			var vehicles = repository.Get(
				v => v.Garage.OwnerID == filterConditions.ProviderID
			);

			var recordsTotal = vehicles.Count();

			// Filters, GO!!
			// Filters that can take out the most records with the least work go first

			// LicenseNumber condition
			if (filterConditions.LicenseNumber != null)
			{
				vehicles = vehicles.Where(v => v.LicenseNumber.Contains(filterConditions.LicenseNumber));
			}

			// Name condtion
			if (filterConditions.Name != null)
			{
				vehicles = vehicles.Where(v => v.Name.Contains(filterConditions.Name));
			}

			// GarageIDList condition
			if (filterConditions.GarageIDList != null)
			{
				vehicles = vehicles.Where(v => filterConditions.VehicleGroupIDList.Contains(v.GarageID));
			}

			// VehicleGroupIDList condtion
			if (filterConditions.VehicleGroupIDList != null)
			{
				vehicles = vehicles.Where(v => filterConditions.VehicleGroupIDList.Contains(v.VehicleGroupID));
			}

			// Max Rating condition
			if (filterConditions.MaxRating != null)
			{
				vehicles = vehicles.Where(v => v.Star <= filterConditions.MaxRating);
			}

			// Min Rating condition
			if (filterConditions.MinRating != null)
			{
				vehicles = vehicles.Where(v => v.Star >= filterConditions.MinRating);
			}

			// Run basic common filters
			vehicles = BasicFilter(vehicles, filterConditions);

			// Paginate
			var filteredRecords = vehicles.Count();
			if ((filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage > filteredRecords)
				filterConditions.Page = 1;

			vehicles = vehicles.Skip((filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
					.Take(Constants.NumberOfSearchResultPerPage);

			// Order
			var prop2 = typeof(VehicleManagementItemJsonModel).GetProperty(filterConditions.OrderBy);
			vehicles = filterConditions.IsDescendingOrder
				? vehicles.OrderByDescending(r => prop2.GetValue(r))
				: vehicles.OrderBy(r => prop2.GetValue(r));

			return new VehicleDataTablesJsonModel(vehicles.ToList(), recordsTotal, filteredRecords);
		}

		// Run common filters on a vehicle list
		protected IQueryable<Vehicle> BasicFilter(IQueryable<Vehicle> vehicles , VehicelFilterConditionModel filterConditions)
		{
			// Transmission condition
			if (filterConditions.TransmissionTypeIDList != null)
				vehicles = vehicles.Where(v => filterConditions.TransmissionTypeIDList.Contains(v.TransmissionType));

			// Color condition
			if (filterConditions.ColorIDList != null)
				vehicles = vehicles.Where(v => filterConditions.ColorIDList.Contains(v.Color));

			// FuelType condition
			if (filterConditions.FuelTypeIDList != null)
				vehicles = vehicles.Where(v => filterConditions.FuelTypeIDList.Contains(v.FuelType));

			// Location condition
			if (filterConditions.LocationIDList != null)
				vehicles = vehicles.Where(v => filterConditions.LocationIDList.Contains(v.Garage.LocationID));

			// Category condition
			if (filterConditions.CategoryIDList != null)
				vehicles = vehicles.Where(v => v.Model.Categories.Any(r => filterConditions.CategoryIDList.Contains(r.ID)));

			// Max ProductionYear condition
			if (filterConditions.MaxProductionYear != null)
				vehicles = vehicles.Where(v => v.Year <= filterConditions.MaxProductionYear);

			// Min ProductionYear condition
			if (filterConditions.MinProductionYear != null)
				vehicles = vehicles.Where(v => v.Year >= filterConditions.MinProductionYear);

			// Brand and Model condition
			if (filterConditions.BrandIDList.Any() || filterConditions.ModelIDList.Any())
				vehicles = vehicles.Where(v => filterConditions.BrandIDList.Contains(v.Model.BrandID)
											|| filterConditions.ModelIDList.Contains(v.ModelID));

			return vehicles;
		}

		// Check to see if the vehicle is available
		public bool CheckVehicleAvailability(int vehicleId, DateTime startTime, DateTime endTime)
		{
			var vehicle = this.repository.Get(v => v.ID == vehicleId);

			if (vehicle.Any())
			{
				// Check StartTime/EndTime to be within garage's OpenTime ~ CloseTime
				// Compare by convert time to the number of minute from 00:00
				// Max margin of error: 60 secs vs CloseTime (Because we do not validate to second)

				// Booking StartTime
				var startTimeDoW = (int) startTime.DayOfWeek;
				vehicle = vehicle.Where(v =>
					v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == startTimeDoW
								  && (startTime.Minute + startTime.Hour * 60) >= gwt.OpenTimeInMinute
								  && (startTime.Minute + startTime.Hour * 60) <= gwt.CloseTimeInMinute));

				// Booking EndTime
				var endTimeDoW = (int) endTime.DayOfWeek;
				vehicle = vehicle.Where(v =>
					v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == endTimeDoW
								  && (endTime.Minute + endTime.Hour * 60) >= gwt.OpenTimeInMinute
								  && (endTime.Minute + endTime.Hour * 60) <= gwt.CloseTimeInMinute));

				if (vehicle.Any())
				{
					// Check if this vehicle has any other bookings in the timespan of this booking
					vehicle = vehicle.Where(v =>
						v.BookingReceipts.Any(br => !br.IsCanceled
								&& (
										(startTime > br.StartTime && startTime < br.EndTime)
									 || (endTime > br.StartTime && endTime < br.EndTime)
									 || (startTime <= br.StartTime && endTime >= br.EndTime)
								)));
				}
			}

			return vehicle.Any();
		}
	}
}