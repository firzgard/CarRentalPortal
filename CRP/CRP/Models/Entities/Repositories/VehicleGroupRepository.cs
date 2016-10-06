using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public partial interface IVehicleGroupRepository : IRepository<VehicleGroup>
    {

    }

    public partial class VehicleGroupRepository : BaseRepository<VehicleGroup>, IVehicleGroupRepository
    {
        public VehicleGroupRepository(CRPEntities dbContext) : base(dbContext)
        {
        }
    }
}