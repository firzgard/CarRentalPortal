//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CRP.Models.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Vehicle
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Vehicle()
        {
            this.BookingReceipts = new HashSet<BookingReceipt>();
            this.VehicleImages = new HashSet<VehicleImage>();
        }
    
        public int ID { get; set; }
        public string LicenseNumber { get; set; }
        public string Name { get; set; }
        public int ModelID { get; set; }
        public int Year { get; set; }
        public int GarageID { get; set; }
        public Nullable<int> VehicleGroupID { get; set; }
        public int TransmissionType { get; set; }
        public string TransmissionDetail { get; set; }
        public Nullable<int> FuelType { get; set; }
        public string Engine { get; set; }
        public int Color { get; set; }
        public string Description { get; set; }
        public decimal Star { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BookingReceipt> BookingReceipts { get; set; }
        public virtual Garage Garage { get; set; }
        public virtual Model Model { get; set; }
        public virtual VehicleGroup VehicleGroup { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VehicleImage> VehicleImages { get; set; }
    }
}
