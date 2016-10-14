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
	public interface IVehicleService : IService<Vehicle>
	{
		IVehicleFilterJsonModel FilterVehicle(VehicelFilterConditionModel filterConditions);
	}

	public class VehicleService : BaseService<Vehicle>, IVehicleService
	{
		public VehicleService(IUnitOfWork unitOfWork, IVehicleRepository repository) : base(unitOfWork, repository)
		{

		}

		public IVehicleFilterJsonModel FilterVehicle(VehicelFilterConditionModel filterConditions)
		{
			// Filters that can take out the most records with the least work go first

			IEnumerable<Vehicle> vehicles;
			int recordsTotal = 0, filteredRecords;

			// ========================================================
			// ========================================================
			if (filterConditions is VehicleManagementFilterConditionModel)
			{
				var resolvedFilterCondition = (VehicleManagementFilterConditionModel)filterConditions;

				// Get only vehicles belonged to this user
				vehicles = this.repository.Get(
					v => v.Garage.OwnerID == resolvedFilterCondition.ProviderID
				);
				recordsTotal = vehicles.Count();

				// LicenseNumber condition
				if (resolvedFilterCondition.LicenseNumber != null)
				{
					vehicles = vehicles.Where(v => v.LicenseNumber.Contains(resolvedFilterCondition.LicenseNumber));
				}

				// Name condtion
				if (resolvedFilterCondition.Name != null)
				{
					vehicles = vehicles.Where(v => v.Name.Contains(resolvedFilterCondition.Name));
				}

				// GarageIDList condition
				if (resolvedFilterCondition.GarageIDList != null)
				{
					vehicles = vehicles.Where(v => resolvedFilterCondition.VehicleGroupIDList.Contains(v.GarageID));
				}

				// VehicleGroupIDList condtion
				if (resolvedFilterCondition.VehicleGroupIDList != null)
				{
					vehicles = vehicles.Where(v => resolvedFilterCondition.VehicleGroupIDList.Contains(v.VehicleGroupID));
				}

				// Max Rating condition
				if (resolvedFilterCondition.MaxRating != null)
				{
					vehicles = vehicles.Where(v => v.Star <= resolvedFilterCondition.MaxRating);
				}

				// Min Rating condition
				if (resolvedFilterCondition.MinRating != null)
				{
					vehicles = vehicles.Where(v => v.Star >= resolvedFilterCondition.MinRating);
				}
			}
			else {
				vehicles = this.repository.Get();
			}

			// Other Filters, go!!

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

			vehicles.ToList();
			if (filterConditions.CategoryIDList != null)
				vehicles.Where(v =>
				{
					IEnumerable<Category> a = v.Model.Categories.Where(r => filterConditions.CategoryIDList.Contains(r.ID));
					return a.Any();
				});

			// Category condition
			if (filterConditions.CategoryIDList != null)
				vehicles = vehicles.Where(v => v.Model.Categories.Where(r => filterConditions.CategoryIDList.Contains(r.ID)).Any());

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
			
			// ========================================================
			// ========================================================
			if (filterConditions is SearchConditionModel)
			{
				var resolvedFilterCondition = (SearchConditionModel)filterConditions;

				// NumOfSeatList condition
				if (resolvedFilterCondition.NumberOfSeatList != null)
					vehicles = vehicles.Where(v => ((SearchConditionModel)filterConditions).NumberOfSeatList.Contains(v.Model.NumOfSeat));
				
				// Get the rental time in hour
				TimeSpan rentalTimeSpan = (DateTime)resolvedFilterCondition.EndTime - (DateTime)resolvedFilterCondition.StartTime;
				int rentalTime = (int)Math.Ceiling(rentalTimeSpan.TotalHours);

				// vehicleGroup's max rental time constraint
				vehicles = vehicles.Where(v => v.VehicleGroup.MaxRentalPeriod == null
											|| v.VehicleGroup.MaxRentalPeriod * 24 > rentalTime);
				
				// get only vehicles that are free in the booking period condition
				vehicles = vehicles.Where(v =>
					!(v.BookingReceipts.Where(br => (resolvedFilterCondition.StartTime > br.StartTime && resolvedFilterCondition.StartTime < br.EndTime)
											   || (resolvedFilterCondition.EndTime > br.StartTime && resolvedFilterCondition.EndTime < br.EndTime)
											   || (resolvedFilterCondition.StartTime <= br.StartTime && resolvedFilterCondition.EndTime >= br.EndTime)
					).Any())
				);

				// ================
				
				//vehicles = vehicles.Where(v =>
				//	v.Garage.)
				//);
				// ================

				// Parse into model suitable to send back to browser
				var results = new List<JsonModels.SearchResultItemJsonModel>();
				foreach (Vehicle vehicle in vehicles)
					results.Add(new SearchResultItemJsonModel(vehicle, rentalTime));

				// Max/Min Price conditions
				if (resolvedFilterCondition.MaxPrice != null && resolvedFilterCondition.MinPrice != null
						&& resolvedFilterCondition.MaxPrice > resolvedFilterCondition.MinPrice)
				{
					results = results.Where(
						r => resolvedFilterCondition.MaxPrice >= r.BestPossibleRentalPrice
						  && resolvedFilterCondition.MinPrice <= r.BestPossibleRentalPrice
					).ToList();
				}

				// Paginate
				filteredRecords = results.Count;
				if (resolvedFilterCondition.Page < 1 || (resolvedFilterCondition.Page - 1) * Constants.NumberOfSearchResultPerPage > filteredRecords)
					resolvedFilterCondition.Page = 1;

				results = results.Skip((resolvedFilterCondition.Page - 1) * Constants.NumberOfSearchResultPerPage)
						.Take(Constants.NumberOfSearchResultPerPage)
						.ToList();

				// Order
				System.Reflection.PropertyInfo prop1 = typeof(SearchResultItemJsonModel).GetProperty(resolvedFilterCondition.OrderBy);
				if (resolvedFilterCondition.IsDescendingOrder)
					results = results.OrderByDescending(r => prop1.GetValue(r)).ToList();
				else
					results = results.OrderBy(r => prop1.GetValue(r)).ToList();

				// Nest into result object
				return new SearchResultJsonModel(results, filteredRecords);
			}

			// Paginate
			filteredRecords = vehicles.Count();
			if ((filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage > filteredRecords)
				filterConditions.Page = 1;

			vehicles = vehicles.Skip((filterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
					.Take(Constants.NumberOfSearchResultPerPage);

			// Order
			System.Reflection.PropertyInfo prop2 = typeof(VehicleManagementItemJsonModel).GetProperty(filterConditions.OrderBy);
			if (filterConditions.IsDescendingOrder)
				vehicles = vehicles.OrderByDescending(r => prop2.GetValue(r));
			else
				vehicles = vehicles.OrderBy(r => prop2.GetValue(r));

			return new VehicleDataTablesJsonModel(vehicles.ToList(), recordsTotal, filteredRecords);
		}
	}
}