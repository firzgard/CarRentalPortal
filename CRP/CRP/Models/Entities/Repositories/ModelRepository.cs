using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
    public interface IModelRepository : IRepository<Model>
    {

    }

    public class ModelRepository : BaseRepository<Model>, IModelRepository
    {
        public ModelRepository(CRPEntities dbContext) : base(dbContext)
        {
        }
    }
}