

using AuriStore.Domain.Entities;
using AuriStore.Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuriStore.Infrastructure.Persistence.Configuration
{
    public class UsersConfiguration: IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.UserId);

            builder.Property(u => u.UserName)
                   .HasColumnName("UserName")
                   .HasMaxLength(150)
                   .IsRequired();

            builder.Property(u => u.Email)
                   .HasMaxLength(150)
                   .IsRequired();

            builder.Property(u => u.PasswordHash)
                   .HasMaxLength(300)
                   .IsRequired();

            builder.Property(u => u.UserRole)
                   .HasConversion(
                        v => v.ToString(),                           // enum → string
                        v => (UserRol)Enum.Parse(typeof(UserRol), v) // string → enum
                    )
                   .HasColumnName("UserRole")
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(u => u.CreateDate)
                   .HasColumnName("CreateDate")
                   .HasDefaultValueSql("GETDATE()");
        }
    }
}
