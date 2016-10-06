using CRP.Models.Entities.Repositories;
using CRP.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public interface IVehicleGroupService : IService<VehicleGroup>
    {
        IQueryable<VehicleGroup> getAll();
    }

    public class VehicleGroupService : BaseService<VehicleGroup>, IVehicleGroupService
    {
        public VehicleGroupService(IUnitOfWork unitOfWork, IVehicleGroupRepository repository) : base(unitOfWork, repository)
        {

        }
        public IQueryable<VehicleGroup> getAll()
        {
            throw new NotImplementedException();
        }
    }
}