//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CRP
{
    using System;
    using System.Collections.Generic;
    
    public partial class Garage
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Garage()
        {
            this.Cars = new HashSet<Car>();
        }
    
        public int ID { get; set; }
        public int OwnerID { get; set; }
        public string Name { get; set; }
        public int LocationID { get; set; }
        public string Address { get; set; }
        public Nullable<System.TimeSpan> OpenTime { get; set; }
        public Nullable<System.TimeSpan> CloseTime { get; set; }
        public bool IsActive { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Car> Cars { get; set; }
        public virtual Location Location { get; set; }
        public virtual User User { get; set; }
    }
}